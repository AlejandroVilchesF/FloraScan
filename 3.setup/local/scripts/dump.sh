#!/bin/bash
docker exec mongodb mongodump --db=test --archive > `date +%Y%m%d`"_test_local.dump"