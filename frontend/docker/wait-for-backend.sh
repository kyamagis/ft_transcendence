#!/bin/sh

while true
do
    # nc (netcat) コマンドで API が稼働しているか確認
    nc -z $API_HOST $API_PORT
    # $? は直前のコマンドの終了ステータスを取得する特殊変数
    # 0は成功、それ以外は失敗を示す
    if [ $? -eq 0 ]; then
        # APIが起動していればループを抜ける
        echo "API is up!"
        break
    else
        # APIが起動していなければ1秒待機して再試行
        echo "Waiting for the API to start..."
        sleep 1
    fi
done
