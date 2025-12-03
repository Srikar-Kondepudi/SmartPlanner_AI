#!/usr/bin/env python3
"""
Startup script for Railway deployment
Reads PORT from environment and starts uvicorn
"""
import os
import sys
import subprocess

def main():
    # Get PORT from environment, default to 8000
    port = os.environ.get('PORT', '8000')
    
    # Start uvicorn
    cmd = [
        'uvicorn',
        'app.main:app',
        '--host', '0.0.0.0',
        '--port', str(port)
    ]
    
    sys.exit(subprocess.run(cmd).returncode)

if __name__ == '__main__':
    main()

