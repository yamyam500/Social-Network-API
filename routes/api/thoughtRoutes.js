const router = require('express').Router();
const {
  getThoughts,
  getThought,
  createThought,
  updateThought,
  deleteThought,
  addReaction,
  removeReaction
} = require('../../controllers/thoughtController')


router.route('/')
  .get(getThoughts)
  .post(createThought);

router.route('/:id')
  .get(getThought)
  .put(updateThought)
  .delete(deleteThought)

router.route('/:thoughtId/reaction')
  .post(addReaction)

router.route('/:thoughtId/reaction/:reactionId')
  .delete(removeReaction)

module.exports = router;