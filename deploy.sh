#!/bin/bash

yarn production
rm -rf /tmp/minisweeper-deploy
mkdir /tmp/minisweeper-deploy
cp -r ./web/* /tmp/minisweeper-deploy
git checkout gh-pages
cp -r /tmp/minisweeper-deploy/* ./
git status
