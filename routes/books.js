const express = require('express');
const router = express.Router();
const {
  getBooks,
  getBook,
  createBook,
  updateBook,
  deleteBook,
} = require('../controllers/booksController');
const { bookValidationRules, validateBook } = require('../middleware/validation/booksValidation');

/**
 * @swagger
 * components:
 *   schemas:
 *     Book:
 *       type: object
 *       required:
 *         - title
 *         - authorId
 *       properties:
 *         _id:
 *           type: string
 *           description: The auto-generated id of the book
 *         title:
 *           type: string
 *           description: The title of the book
 *         authorId:
 *           type: string
 *           description: The ID of the book's author
 *         summary:
 *           type: string
 *           description: A short summary of the book
 *         isbn:
 *           type: string
 *           description: The ISBN of the book
 *         genre:
 *           type: array
 *           items:
 *             type: string
 *           description: The genre(s) of the book
 *         publishedYear:
 *           type: integer
 *           description: The year the book was published
 *         pageCount:
 *           type: integer
 *           description: The number of pages in the book
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: The date the book was added to the database
 *       example:
 *         _id: 6601b5c8d8a9b123456789ac
 *         title: The Hobbit
 *         authorId: 6600a5b6d8a9b123456789ab
 *         summary: A reluctant hobbit goes on an adventure.
 *         isbn: 978-0547928227
 *         genre: ["Fantasy", "Adventure"]
 *         publishedYear: 1937
 *         pageCount: 310
 *         createdAt: 2024-03-25T12:00:00.000Z
 */

/**
 * @swagger
 * tags:
 *   name: Books
 *   description: The books managing API
 */

/**
 * @swagger
 * /books:
 *   get:
 *     summary: Returns the list of all books
 *     tags: [Books]
 *     responses:
 *       200:
 *         description: The list of books was successfully retrieved
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 count:
 *                   type: integer
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Book'
 */
router.route('/').get(getBooks);

/**
 * @swagger
 * /books:
 *   post:
 *     summary: Create a new book
 *     tags: [Books]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Book'
 *     responses:
 *       201:
 *         description: The book was successfully created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Book'
 *       400:
 *         description: Validation error (invalid input)
 */
router.route('/').post(bookValidationRules(), validateBook, createBook);

/**
 * @swagger
 * /books/{id}:
 *   get:
 *     summary: Get a book by its id
 *     tags: [Books]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The book id
 *     responses:
 *       200:
 *         description: The book description by id
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Book'
 *       404:
 *         description: The book was not found
 */
router.route('/:id').get(getBook);

/**
 * @swagger
 * /books/{id}:
 *   put:
 *     summary: Update a book by its id
 *     tags: [Books]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The book id
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Book'
 *     responses:
 *       200:
 *         description: The book was successfully updated
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Book'
 *       400:
 *         description: Validation error (invalid input)
 *       404:
 *         description: The book was not found
 */
router.route('/:id').put(bookValidationRules(), validateBook, updateBook);

/**
 * @swagger
 * /books/{id}:
 *   delete:
 *     summary: Delete a book by its id
 *     tags: [Books]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The book id
 *     responses:
 *       200:
 *         description: The book was successfully deleted
 *       404:
 *         description: The book was not found
 */
router.route('/:id').delete(deleteBook);

module.exports = router;