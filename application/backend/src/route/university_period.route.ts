import express from 'express';
const router = express.Router();


router.get('/', async () => {});
router.post('/', async () => {});
router.get('/:id', async () => {});
router.put('/:id', async () => {});
router.delete('/:id', async () => {});
router.get('/:id/next', async () => {});
router.put('/:id/next', async () => {});
router.get('/:id/previous', async () => {});
router.put('/:id/previous', async () => {});

export default router;