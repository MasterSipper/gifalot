# Check Python Version on Server

## Quick Check

Run this on your server to see what Python versions are available:

```bash
# Check all Python installations
ls -la /usr/bin/python*

# Try specific versions
python3.9 --version 2>/dev/null || echo "Python 3.9 not found"
python3.10 --version 2>/dev/null || echo "Python 3.10 not found"
python3.11 --version 2>/dev/null || echo "Python 3.11 not found"
python3.12 --version 2>/dev/null || echo "Python 3.12 not found"

# Check which Python 3 versions exist
which python3.9 python3.10 python3.11 python3.12 2>/dev/null
```

## If Python 3.9+ Exists

I've updated the workflow to use `/usr/bin/python3.9`. If your server has a different version (3.10, 3.11, etc.), let me know and I'll update it.

## If Python 3.9+ Doesn't Exist

You'll need to install it:

```bash
# On your server (Ubuntu/Debian)
sudo apt update
sudo apt install software-properties-common
sudo add-apt-repository ppa:deadsnakes/ppa
sudo apt update
sudo apt install python3.9 python3.9-venv python3.9-distutils

# Verify
python3.9 --version
```

Then the workflow should work.

