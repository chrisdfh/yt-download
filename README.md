# Youtube Downloader

App to be used as a frontend for command line Youtube Downloader

To be used in linux server/workstation only

## Requierements

youtube-dl from [here](https://github.com/ytdl-org/youtube-dl) or use following script

if you use `curl`

```bash
sudo curl -L https://yt-dl.org/downloads/latest/youtube-dl -o /usr/local/bin/youtube-dl
sudo chmod a+rx /usr/local/bin/youtube-dl
```

or `wget`

```bash
sudo wget https://yt-dl.org/downloads/latest/youtube-dl -O /usr/local/bin/youtube-dl
sudo chmod a+rx /usr/local/bin/youtube-dl
```

Must be used on WebServer with _php_ support
