#!/bin/bash
set -e

# ============================================================
# IDfMatrix – Droplet Setup Script
# Ubuntu 24.04, nginx + Node.js + PM2 + SQLite + Let's Encrypt
# ============================================================

RED='\033[0;31m'; GREEN='\033[0;32m'; YELLOW='\033[1;33m'; NC='\033[0m'
info()    { echo -e "${GREEN}[✓]${NC} $1"; }
warn()    { echo -e "${YELLOW}[!]${NC} $1"; }
section() { echo -e "\n${GREEN}══════════════════════════════${NC}"; echo -e "${GREEN} $1${NC}"; echo -e "${GREEN}══════════════════════════════${NC}"; }

# Als root ausführen
if [ "$EUID" -ne 0 ]; then echo -e "${RED}Bitte als root ausführen${NC}"; exit 1; fi

section "1 · Konfiguration"
read -p "Domain (z.B. idfmatrix.evolutionid.com): " DOMAIN
read -p "Site-Passwort (Konfigurator-Zugang):      " SITE_PASSWORD
read -s -p "Admin-Passwort (Admin-UI):                " ADMIN_PASSWORD; echo
read -p "Resend API Key (re_...):                  " RESEND_API_KEY
read -p "E-Mail für SSL-Zertifikat:                " SSL_EMAIL

APP_USER="idfmatrix"
APP_DIR="/opt/idfmatrix"
REPO="https://github.com/florian-schoen/idfmatrix.git"

section "2 · System aktualisieren"
apt-get update -qq && apt-get upgrade -y -qq
apt-get install -y -qq curl git ufw nginx certbot python3-certbot-nginx
info "System aktualisiert"

section "3 · Node.js 22 LTS installieren"
curl -fsSL https://deb.nodesource.com/setup_22.x | bash -
apt-get install -y -qq nodejs
npm install -g pm2 --silent
info "Node.js $(node -v) + PM2 $(pm2 -v) installiert"

section "4 · Linux-User '$APP_USER' anlegen"
if id "$APP_USER" &>/dev/null; then
  warn "User $APP_USER existiert bereits"
else
  useradd -m -s /bin/bash "$APP_USER"
  info "User $APP_USER erstellt"
fi

# SSH-Key vom Root-User übernehmen
mkdir -p /home/$APP_USER/.ssh
cp /root/.ssh/authorized_keys /home/$APP_USER/.ssh/authorized_keys
chown -R $APP_USER:$APP_USER /home/$APP_USER/.ssh
chmod 700 /home/$APP_USER/.ssh
chmod 600 /home/$APP_USER/.ssh/authorized_keys
info "SSH-Key übertragen"

section "5 · App-Verzeichnis & Repo"
mkdir -p $APP_DIR
git clone $REPO $APP_DIR || (cd $APP_DIR && git pull)
chown -R $APP_USER:$APP_USER $APP_DIR
info "Repo geklont nach $APP_DIR"

section "6 · Node-Dependencies installieren"
cd $APP_DIR/server
npm install --silent
mkdir -p $APP_DIR/server/data
chown -R $APP_USER:$APP_USER $APP_DIR/server/data
info "npm install abgeschlossen"

section "7 · .env anlegen"
cat > $APP_DIR/.env <<EOF
PORT=3000
NODE_ENV=production
SITE_PASSWORD=$SITE_PASSWORD
ADMIN_PASSWORD=$ADMIN_PASSWORD
RESEND_API_KEY=$RESEND_API_KEY
MAIL_FROM=idfmatrix@evolutionid.com
MAIL_TO=sales@evolutionid.com
DB_PATH=$APP_DIR/server/data/idfmatrix.db
EOF
chmod 600 $APP_DIR/.env
chown $APP_USER:$APP_USER $APP_DIR/.env
info ".env erstellt"

section "8 · PM2 einrichten"
cd $APP_DIR/server
sudo -u $APP_USER pm2 start server.js --name idfmatrix --cwd $APP_DIR/server
sudo -u $APP_USER pm2 save
env PATH=$PATH:/usr/bin pm2 startup systemd -u $APP_USER --hp /home/$APP_USER
info "PM2 gestartet und autostart eingerichtet"

section "9 · Firewall (ufw)"
ufw allow OpenSSH
ufw allow 'Nginx Full'
ufw --force enable
info "Firewall aktiv (SSH + HTTP/HTTPS erlaubt)"

section "10 · nginx konfigurieren"
cat > /etc/nginx/sites-available/idfmatrix <<EOF
server {
    listen 80;
    server_name $DOMAIN;

    location / {
        proxy_pass         http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header   Upgrade \$http_upgrade;
        proxy_set_header   Connection 'upgrade';
        proxy_set_header   Host \$host;
        proxy_set_header   X-Real-IP \$remote_addr;
        proxy_set_header   X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header   X-Forwarded-Proto \$scheme;
        proxy_cache_bypass \$http_upgrade;
    }
}
EOF
ln -sf /etc/nginx/sites-available/idfmatrix /etc/nginx/sites-enabled/idfmatrix
rm -f /etc/nginx/sites-enabled/default
nginx -t && systemctl reload nginx
info "nginx konfiguriert"

section "11 · SSL-Zertifikat (Let's Encrypt)"
warn "DNS-Eintrag für $DOMAIN muss auf $(curl -s ifconfig.me) zeigen!"
read -p "DNS bereits gesetzt? (j/n): " DNS_READY
if [ "$DNS_READY" = "j" ]; then
  certbot --nginx -d $DOMAIN --non-interactive --agree-tos -m $SSL_EMAIL
  info "SSL-Zertifikat ausgestellt"
else
  warn "SSL übersprungen – später ausführen: certbot --nginx -d $DOMAIN -m $SSL_EMAIL"
fi

section "✓ Setup abgeschlossen"
echo ""
echo -e "  App-Verzeichnis: ${GREEN}$APP_DIR${NC}"
echo -e "  PM2 Status:      ${GREEN}$(sudo -u $APP_USER pm2 list | grep idfmatrix | awk '{print $18}')${NC}"
echo -e "  URL:             ${GREEN}http://$DOMAIN${NC} (oder https:// nach SSL)"
echo ""
echo -e "  SSH als idfmatrix-User: ${YELLOW}ssh -i ~/.ssh/idfmatrix $APP_USER@$(curl -s ifconfig.me)${NC}"
echo ""
