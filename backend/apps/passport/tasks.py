from celery import shared_task
import logging

logger = logging.getLogger(__name__)


@shared_task(bind=True, max_retries=3, default_retry_delay=60)
def process_document(self, document_id: str):
    """Extract metadata from uploaded PDF using PaperQA2."""
    from .models import Document
    from .services.document_service import DocumentService

    try:
        doc = Document.objects.get(id=document_id)
        doc.processing_status = 'processing'
        doc.save(update_fields=['processing_status'])

        service = DocumentService()
        extracted = service.extract_from_pdf(doc.file.path)

        doc.extracted_data = extracted
        doc.processing_status = 'completed'
        doc.save(update_fields=['extracted_data', 'processing_status'])

        logger.info(f"Document {document_id} processed successfully")
        return {'status': 'success', 'document_id': document_id}

    except Exception as exc:
        logger.error(f"Document {document_id} processing failed: {exc}")
        doc = Document.objects.get(id=document_id)
        doc.processing_status = 'failed'
        doc.save(update_fields=['processing_status'])
        raise self.retry(exc=exc)


@shared_task
def generate_expert_embedding(expert_id: str):
    """Generate/update embedding vector for an expert after profile change."""
    from apps.matching.services.embedding_service import EmbeddingService

    service = EmbeddingService()
    service.generate_embedding(expert_id)
    logger.info(f"Embedding generated for expert {expert_id}")
