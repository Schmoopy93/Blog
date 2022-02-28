module.exports = (sequelize, Sequelize) => {
  const Post = sequelize.define("posts", {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    title: {
      type: Sequelize.STRING,
    },
    content: {
      type: Sequelize.TEXT
    },
    type: {
      type: Sequelize.STRING
    },
    name: {
      type: Sequelize.STRING
    },
    data: {
      type: Sequelize.BLOB("long"),
    },
  });

  return Post;
};