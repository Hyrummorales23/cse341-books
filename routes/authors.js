const express = require('express');
const router = express.Router();
const {
  getAuthors,
  getAuthor,
  createAuthor,
  updateAuthor,
  deleteAuthor,
} = require('../controllers/authorsController');
const { authorValidationRules, validateAuthor } = require('../middleware/validation/authorsValidation');
const { isAuthenticated } = require('../middleware/auth');

/**
 * @swagger
 * components:
 *   schemas:
 *     Author:
 *       type: object
 *       required:
 *         - firstName
 *         - lastName
 *       properties:
 *         _id:
 *           type: string
 *           description: The auto-generated id of the author
 *         firstName:
 *           type: string
 *           description: The author's first name
 *         lastName:
 *           type: string
 *           description: The author's last name
 *         dateOfBirth:
 *           type: string
 *           format: date
 *           description: The author's date of birth
 *         dateOfDeath:
 *           type: string
 *           format: date
 *           description: The author's date of death
 *         nationality:
 *           type: string
 *           description: The author's nationality
 *         biography:
 *           type: string
 *           description: A short biography of the author
 *         website:
 *           type: string
 *           format: url
 *           description: The author's website
 *         isActive:
 *           type: boolean
 *           description: Whether the author is listed as active
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: The date the author was added
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: The date the author was last updated
 *       example:
 *         _id: 6600a5b6d8a9b123456789ab
 *         firstName: J.R.R.
 *         lastName: Tolkien
 *         dateOfBirth: 1892-01-03
 *         dateOfDeath: 1973-09-02
 *         nationality: British
 *         biography: John Ronald Reuel Tolkien was an English writer, poet...
 *         website: https://www.tolkiensociety.org
 *         isActive: true
 *         createdAt: 2024-03-24T10:00:00.000Z
 *         updatedAt: 2024-03-24T10:00:00.000Z
 */

/**
 * @swagger
 * tags:
 *   name: Authors
 *   description: The authors managing API
 */

/**
 * @swagger
 * /authors:
 *   get:
 *     summary: Returns the list of all authors
 *     tags: [Authors]
 *     responses:
 *       200:
 *         description: The list of authors was successfully retrieved
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
 *                     $ref: '#/components/schemas/Author'
 */
router.route('/').get(getAuthors);

/**
 * @swagger
 * /authors:
 *   post:
 *     summary: Create a new author
 *     tags: [Authors]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Author'
 *     responses:
 *       201:
 *         description: The author was successfully created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Author'
 *       400:
 *         description: Validation error (invalid input)
 */
router.route('/').post(isAuthenticated, authorValidationRules(), validateAuthor, createAuthor);

/**
 * @swagger
 * /authors/{id}:
 *   get:
 *     summary: Get an author by id
 *     tags: [Authors]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The author id
 *     responses:
 *       200:
 *         description: The author description by id
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Author'
 *       404:
 *         description: The author was not found
 */
router.route('/:id').get(getAuthor);

/**
 * @swagger
 * /authors/{id}:
 *   put:
 *     summary: Update an author by id
 *     tags: [Authors]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The author id
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Author'
 *     responses:
 *       200:
 *         description: The author was successfully updated
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Author'
 *       400:
 *         description: Validation error (invalid input)
 *       404:
 *         description: The author was not found
 */
router.route('/:id').put(isAuthenticated, authorValidationRules(), validateAuthor, updateAuthor);

/**
 * @swagger
 * /authors/{id}:
 *   delete:
 *     summary: Delete an author by id
 *     tags: [Authors]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The author id
 *     responses:
 *       200:
 *         description: The author was successfully deleted
 *       404:
 *         description: The author was not found
 */
router.route('/:id').delete(isAuthenticated, deleteAuthor);

module.exports = router;