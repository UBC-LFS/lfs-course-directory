const app = require('./app')

const { PORT = 10081 } = process.env
app.listen(PORT, () => console.log(`Listening on port ${PORT}`))
