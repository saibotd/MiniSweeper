#!/bin/bash

yarn production
git checkout gh-pages
cp -r ./web/* ./
git status
