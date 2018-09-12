#!/bin/sh

if [ ! -n "$1" ]; then
    input_file="devinfo.txt"
else
    input_file=$1
fi
if [ ! -n "$2" ]; then
    output_dir="output"
else
    output_dir=$2
fi

if [ -f $input_file ]; then
    echo
else
    echo $input_file" is not exist!";
    exit 0;
fi

mkdir -p $output_dir"/enc"
mkdir -p $output_dir"/normal"

rm -rf $output_dir/enc/*
rm -rf $output_dir/normal/*


tr -d "\015" < $input_file > devinfo.txt.tmp
mv devinfo.txt.tmp $input_file


cat $input_file |while read LINE
do

uid=`echo $LINE|awk '{print $1}'`
mac=`echo $LINE|awk '{print $2}'|tr '[A-Z]' '[a-z]'`
macname=`echo $mac|awk -F: '{print $1$2$3$4$5$6}'`
serialnum=`echo $LINE|awk '{print $3}'`
if [ -z "$uid" ]
then
	echo "uid is null"
	exit 0;
fi
if [ -z "$mac" ]
then
	echo "mac is null"
	exit 0;
fi
if [ -z "$serialnum" ]
then
	echo "serialnum is null"
	exit 0;
fi

license="license_"$macname"_"$uid;

echo  $uid$mac$serialnum > tmp.txt
md5sum tmp.txt|awk '{print $1}' > $output_dir/normal/$license
DES/run_des -e DES/deskeyfile.key $output_dir/normal/$license $output_dir/enc/$license > /dev/null
rm -rf tmp.txt
echo "generate "$license" success!"
done
