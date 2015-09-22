#!/bin/bash

ruby ./parse.rb tech > data/tech.json
ruby ./parse.rb general > data/general.json
ruby ./parse.rb extra > data/extra.json
