#!/bin/bash

ruby ./parse.rb tech > app/tech.json
ruby ./parse.rb general > app/general.json
ruby ./parse.rb extra > app/extra.json
