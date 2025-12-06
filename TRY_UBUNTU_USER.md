# Try Ubuntu User Instead of Root

Since root login is failing, try logging in as "ubuntu" user - this is common on Ubuntu VPS.

## At VNC Login Prompt

1. **Type:** `ubuntu`
2. **Press Enter**
3. **Enter password:** `wc3EaD1cRmmXyLtt8o2C`
4. **Press Enter**

## If Ubuntu Login Works

Once logged in, you'll see:
```
ubuntu@vmi1301963:~$
```

Then become root using sudo:

```bash
sudo su -
```

Or:

```bash
sudo -i
```

Enter the same password (`wc3EaD1cRmmXyLtt8o2C`) when prompted.

You should now be root:
```
root@vmi1301963:~#
```

## Then Set Up ngrok Service

Once you're root (either by logging in directly or using sudo), create the service file:

```bash
nano /etc/systemd/system/ngrok.service
```

Paste this:
```ini
[Unit]
Description=ngrok tunnel for gifalot backend
After=network.target

[Service]
Type=simple
User=root
ExecStart=/usr/local/bin/ngrok http 3001 --log=stdout
Restart=always
RestartSec=10

[Install]
WantedBy=multi-user.target
```

Save: `Ctrl+X`, `Y`, `Enter`

Then:
```bash
systemctl daemon-reload
systemctl enable ngrok
systemctl start ngrok
systemctl status ngrok
```

## Other Common Usernames to Try

If "ubuntu" doesn't work, try:
- `admin`
- `user`
- `deploy`
- `git`

Use the same password: `wc3EaD1cRmmXyLtt8o2C`

## If Nothing Works

Reset the password in Contabo control panel:
1. Go to: https://my.contabo.com/
2. VPS section → Your VPS
3. Reset Root Password
4. Wait 2-3 minutes
5. Try again

**Try "ubuntu" as the username first!** 🔑


