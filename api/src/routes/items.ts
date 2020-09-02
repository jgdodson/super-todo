import { query, param, body } from 'express-validator/check';
import { matchedData } from 'express-validator/filter';
import { Router, Request } from 'express';

import helpers from '../helpers';
import validators from '../middleware/validators';

const router = Router();

/**
 * Gets items for the user
 *
 * Does not create a session
 */
router.get(
  '/',

  async (req: Request, res) => {
    let items = [];

    if (req.session?.user) {
      items = req.session.user.items;
    }

    res.json(items);
  },
);

/**
 * Creates an item for the user
 *
 * Creates a session if one does not exist
 */
router.post(
  '/',

  async (req, res) => {
    let user = {
      lastId: 0,
      items: [],
    };

    if (req.session?.user) {
      user = req.session.user;
    }

    user.lastId += 1;
    const createdAt = helpers.epochSeconds();

    const newItem = {
      id: user.lastId,
      isComplete: false,
      createdAt,
      updatedAt: createdAt,
    };

    user.items.push(newItem);

    req.session.user = user;

    // Echo the new item
    res.json(newItem);
  },
);

/**
 * Deletes an item for the user
 *
 * Does not create a session
 */
router.delete(
  '/:id',

  param('id').isInt({ min: 0 }).toInt(),

  async (req, res) => {
    const { id } = matchedData(req);

    let user = {
      lastId: 0,
      items: [],
    };

    if (req.session?.user) {
      user = req.session.user;
    }

    user.items = user.items.filter((item) => item.id !== id);

    res.sendStatus(200);
  },
);

/**
 * Update an item
 *
 * Does not create a session
 */
router.put(
  '/:id',

  param('id').isInt({ min: 0 }).toInt(),
  body('isComplete').isBoolean().toBoolean(true).optional(),
  body('text').isLength({ max: 255 }).optional(),

  async (req, res) => {
    const { id } = matchedData(req, { locations: ['params'] });
    const updateFields = matchedData(req, { locations: ['body'] });

    const updatedAt = helpers.epochSeconds();

    let user = {
      lastId: 0,
      items: [],
    };

    if (req.session?.user) {
      user = req.session.user;
    }

    user.items = user.items.map((item) => {
      if (item.id === id) {
        return {
          ...item,
          ...updateFields,
          updatedAt,
        };
      } else {
        return item;
      }
    });

    res.sendStatus(200);
  },
);

export default router;
