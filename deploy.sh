#!/bin/bash

yarn production
mkdir /tmp/minisweeper-deploy
cp -r ./web/* /tmp/minisweeper-deploy
git checkout gh-pages
cp -r /tmp/minisweeper-deploy/* ./
git status
