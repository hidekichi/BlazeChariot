/*
module.exports = function(collectionApi) {
  let categoryTags = {};

  // 全コレクションのページを取得
  let allPosts = collectionApi.getAll();
  
  allPosts.forEach(post => {
    // ファイルパスからカテゴリを取得
    let category = post.filePathStem.split("/")[1]; // 例: blog, guitar

    // フロントマターからタグを取得
    let tags = post.data.tags || [];

    // カテゴリごとのタグリストを作成
    if (!categoryTags[category]) {
      categoryTags[category] = {};
    }

    tags.forEach(tag => {
      if (!categoryTags[category][tag]) {
        categoryTags[category][tag] = 0;
      }
      categoryTags[category][tag]++;
    });
  });

  return categoryTags;
};
*/