  #!/bin/sh

  # CLone the Github Repositry  
   git clone https://github.com/EnableX/One-to-One-Video-Chat-Sample-Web-Application.git --recursive

  #Creating Self-Signed Certficate path ./One-to-One-Video-Chat-Sample-Web-Application/server/certs/
   cd One-to-One-Video-Chat-Sample-Web-Application
   cd server
   mkdir certs
   
   sudo openssl req -x509 -newkey rsa:4096 -keyout ./certs/example.key -out ./certs/example.crt -days 10000 -nodes
   sudo chmod 755 ./certs/example.*
   cd ..
  #Getting Node Server Port 
   echo "Enter Node port on which your application will run"
   read SERVICE_PORT
   export SERVICE_PORT
 
 #Getting Enablx App ID And Key

   echo "Enter Your EnableX App ID "
   read ENABLEX_APP_ID
   export ENABLEX_APP_ID
   echo "Enter Your EnableX App Key"
   read  ENABLEX_APP_KEY
   export ENABLEX_APP_KEY

# Installing node Module And Starting Node Server At given Port
   npm install
   cd server
   node server.js
