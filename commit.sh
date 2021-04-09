time=$(date "+%Y-%m-%d %H:%M:%S")
memo=$time
if [ $1 ]; then
   memo=$1
fi
# echo $memo
git add .
git commit -m "$memo"
git push