#!/bin/sh

id=$1

cd license_generate_tool

sh generate.sh devinfo$id output$id

cd output$id
zip -r ../../download/license$id'.zip' enc

cd ..
rm -rf devinfo$id output$id
