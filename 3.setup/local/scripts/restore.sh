#!/bin/bash
cp *.dump test_db_backup.dump
docker cp test_db_backup.dump mongodb:/test_db_backup.dump && docker exec -i mongodb mongorestore --archive="test_db_backup.dump" --nsFrom='test.*' --nsTo='test.*' --host=localhost --drop
docker exec mongodb rm test_db_backup.dump
rm test_db_backup.dump