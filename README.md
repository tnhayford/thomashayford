# thomashayford.site deployment

## Start or update

```bash
cd /opt/websites/thomashayford
docker compose up -d
```

## Restart container

```bash
docker restart thomashayford-web
```

## Full rebuild (cache-busting + restart)

```bash
cd /opt/websites/thomashayford
./rebuild-site.sh
```

Optional explicit version:

```bash
cd /opt/websites/thomashayford
./rebuild-site.sh 2026022801
```

## DNS records

- `A` record: `thomashayford.site` -> `138.199.192.146`
- `A` record: `www.thomashayford.site` -> `138.199.192.146`

## Site structure

- `/index.html` (home and identity anchor)
- `/about/`
- `/who-is-thomas-hayford/` (name disambiguation)
- `/cv.html` and `/files/CV_2026_Hayford_Thomas.pdf`
- `/journal/` with category hubs
- `/journal/templates/post-template.html`
- `/feed.xml`
- `/robots.txt`
- `/sitemap.xml`

## Content workflow

Create a new post page with:

```bash
/opt/websites/thomashayford/new-post.sh <category> <slug> "<title>" "<summary>" <YYYY-MM-DD>
```

Example:

```bash
/opt/websites/thomashayford/new-post.sh business reliability-improvements-q2 "Reliability Improvements Q2" "How we reduced failure classes across critical workflows." 2026-03-01
```

Then manually update:
- `/opt/websites/thomashayford/dist/journal/index.html`
- the related category page
- `/opt/websites/thomashayford/dist/sitemap.xml`
