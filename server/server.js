import express from 'express'
import dotenv from 'dotenv'
import cors from 'cors'
import connectDB from './config/db.js'

dotenv.config()

const app = express()

// Connect to Database
connectDB()

// Middleware
app.use(cors())
app.use(express.json())

// Placeholder Route
app.get('/', (req, res) => {
  res.send('CampusShare API is running...')
})

const PORT = process.env.PORT || 5000

app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`)
})
