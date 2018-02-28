#!/bin/bash

yarn production
git checkout gh-pages
mv ./web/* ./
rm -rf ./web
git status
