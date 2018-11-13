/**
 * Welcome to your Workbox-powered service worker!
 *
 * You'll need to register this file in your web app and you should
 * disable HTTP caching for this file too.
 * See https://goo.gl/nhQhGp
 *
 * The rest of the code is auto-generated. Please don't update this file
 * directly; instead, make changes to your Workbox build configuration
 * and re-run your build process.
 * See https://goo.gl/2aRDsh
 */

importScripts("https://storage.googleapis.com/workbox-cdn/releases/3.6.3/workbox-sw.js");

/**
 * The workboxSW.precacheAndRoute() method efficiently caches and responds to
 * requests for URLs in the manifest.
 * See https://goo.gl/S9QRab
 */
self.__precacheManifest = [
  {
    "url": "css/home.css",
    "revision": "37fed4f52d027431d9690da5c71c5ab3"
  },
  {
    "url": "css/home2.css",
    "revision": "22e7c29c6e936cb3a2a5b9df4603bcf9"
  },
  {
    "url": "css/review.css",
    "revision": "c1f21dfe884362dc2f0b185f6c66fc12"
  },
  {
    "url": "data/restaurants.json",
    "revision": "0531c074066a368ac27fded1461cc8d7"
  },
  {
    "url": "img/1.jpg",
    "revision": "cc074688becddd2725114187fba9471c"
  },
  {
    "url": "img/10.jpg",
    "revision": "2bd68efbe70c926de6609946e359faa2"
  },
  {
    "url": "img/2.jpg",
    "revision": "759b34e9a95647fbea0933207f8fc401"
  },
  {
    "url": "img/3.jpg",
    "revision": "81ee36a32bcfeea00db09f9e08d56cd8"
  },
  {
    "url": "img/4.jpg",
    "revision": "23f21d5c53cbd8b0fb2a37af79d0d37f"
  },
  {
    "url": "img/5.jpg",
    "revision": "0a166f0f4e10c36882f97327b3835aec"
  },
  {
    "url": "img/6.jpg",
    "revision": "eaf1fec4ee66e121cadc608435fec72f"
  },
  {
    "url": "img/7.jpg",
    "revision": "bd0ac197c58cf9853dc49b6d1d7581cd"
  },
  {
    "url": "img/8.jpg",
    "revision": "6e0e6fb335ba49a4a732591f79000bb4"
  },
  {
    "url": "img/9.jpg",
    "revision": "ba4260dee2806745957f4ac41a20fa72"
  },
  {
    "url": "img/unaltered/icon.png",
    "revision": "ebaa8e08f3b384a0317fc4fad0a10a37"
  },
  {
    "url": "img/unaltered/icons/udacity-1-168.png",
    "revision": "19b5036c4a6b4717220ca26fb2b979d2"
  },
  {
    "url": "img/unaltered/icons/udacity-2-579.png",
    "revision": "7b4737d04f1c92ff272eaaa9f25fb157"
  },
  {
    "url": "img/unaltered/offline.png",
    "revision": "cd1d7fd408d63434158f3e072cced9c9"
  },
  {
    "url": "index.html",
    "revision": "cd59a89cec817513434fd17725d53407"
  },
  {
    "url": "js/dbhelper.1.js",
    "revision": "d2f6b84bc2c8a7bae689a9658f2e2d4d"
  },
  {
    "url": "js/dbhelper.js",
    "revision": "3da1c3acfee0eec6496629524c166a9b"
  },
  {
    "url": "js/main.js",
    "revision": "bba22dbd4675fac8c323b91938371d00"
  },
  {
    "url": "js/register.js",
    "revision": "d66cc1343696361d349e4e750ea4aa05"
  },
  {
    "url": "js/restaurant_info.js",
    "revision": "9118b3be951e014a84f245d8223d07fd"
  },
  {
    "url": "manifest.json",
    "revision": "5a3ddb0390e5cfd87ab779c426b56f55"
  },
  {
    "url": "restaurant.html",
    "revision": "196d8054e66cfa8023b2148a22ce88cc"
  }
].concat(self.__precacheManifest || []);
workbox.precaching.suppressWarnings();
workbox.precaching.precacheAndRoute(self.__precacheManifest, {});
