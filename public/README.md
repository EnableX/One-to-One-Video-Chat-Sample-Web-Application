# Real time video communication application (One to One) using EnableX platform (Only Client End Application)

User application requires `two` components to initiate and perform real-time communications hosted on `EnableX platform`.
- An `Application Server` running as a Web Service which uses EnableX Video Server API to create token for hosted RTC Applications.
- `Client Application` running on Client End Points (Web browser, native clients like Android & iOS etc.) which uses EnableX Client Toolkits / SDKs to establish a RTC session with EnableX Platform.

![EnableX Architecture](https://developer.enablex.io/wp-content/uploads/2019/08/app-architecture.png)

This github sample project will enable you to create a `Client Application` for a very simple real time video communication application using EnableX Web SDK.

You also need to setup an `Application Server`.  Clone this Repository `git clone https://github.com/EnableX/video-api-app-server-nodejs.git --recursive` & follow the steps further for setting up `Application Server`.

You can clone repository `git clone https://github.com/EnableX/One-to-One-Video-Chat-Sample-Web-Application.git --recursive` if you want to have both `Application Server` and `Client Application` in a single repository.

---
## Requirements

For development, you will only need Node.js and a node global package, npm, installed in your environement.

### Node
- #### Node installation on Windows

  Just go on [official Node.js website](https://nodejs.org/) and download the installer.
Also, be sure to have `git` available in your PATH, `npm` might need it (You can find git [here](https://git-scm.com/)).

- #### Node installation on Ubuntu

  You can install nodejs and npm easily with apt install, just run the following commands.

      $ sudo apt install nodejs
      $ sudo apt install npm

- #### Other Operating Systems
  You can find more information about the installation on the [official Node.js website](https://nodejs.org/) and the [official NPM website](https://npmjs.org/).

If the installation was successful, you should be able to run the following command.

    $ node --version
    v12.17.0

    $ npm --version
    6.14.4

---

## Setup

### Setup EnableX video calling application

      $ npm install -g http-server
      $ git clone https://github.com/EnableX/One-to-One-Video-WebToolKit-Sample.git
      $ cd One-to-One-Video-WebToolKit-Sample

### TLS/SSL
- The Client Application serving Web Client Pages needs to run on https. You will require a valid SSL Certificate for your Application Server domain to connect to EnableX platform.

- First, you need to make sure that openssl is installed correctly, and you have `key.pem` and `cert.pem` files. You can generate them using this command:

Linux/Mac :

      $ sudo openssl req -newkey rsa:2048 -new -nodes -x509 -days 3650 -keyout key.pem -out cert.pem

Windows( use Git Bash ):

      $ openssl req -newkey rsa:2048 -new -nodes -x509 -days 3650 -keyout key.pem -out cert.pem

- This generates a cert-key pair.

## Configure app

Update Your Application server URL to following file -

- Open `js/index.js`, `js/room.js` & `js/util.js` file and set the value of `apiUrl`


## Running the project

- You need to run the server with -S for enabling SSL and -C for your certificate file.

    $ http-server -S -C cert.pem
