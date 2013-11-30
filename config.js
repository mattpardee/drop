module.exports = [
	'./app/core/plugins/socket',
    './app/plugins/template/server',
    './app/plugins/todos/server',
    {
      packagePath: "./app/core/plugins/mongo",
      mongo: {
        'hostname': 'localhost',
        'port': 27017,
        'username': '',
        'password': '',
        'name': '',
        'db': 'drop-dev'
      }
    },
];