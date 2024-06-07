import express from 'express';
const router = express.Router();
import { ApiResponse, ApiRequest } from "types/Api";

router.get('/', async () => {});
router.post('/', async () => {});
router.get('/:id', async () => {});
router.put('/:id', async () => {});
router.delete('/:id', async () => {});
router.get('/:id/inscription_types', async () => {});
router.post('/:id/inscription_types', async () => {});
router.get('/:id/inscription_types/:inscription_type_id', async () => {});
router.put('/:id/inscription_types/:inscription_type_id', async () => {});
router.delete('/:id/inscription_types/:inscription_type_id', async () => {});
router.get('/types', async () => {});
router.put('/types/:name', async () => {});
router.delete('/types/:name', async () => {});

export default router;