# Mr.Mime
> Front-end for mr.mime application

### Install:
```bash
git clone https://github.com/asdteam-ltd/app-mr-mime.git
cd app-mr-mime
npm i
```

### Start:
```bash
npm start
```

### Build:
```bash
npm run build
```

### Deploy:
1. Create `ssh-config.json` file in root
```json
{
      "host": "YO.UR.HO.ST",
      "port": 0,
      "username": "YourUsername",
      "password": "YourPassword"
}
```

And after that run deploy script in terminal:
```bash
npm run deploy
```
