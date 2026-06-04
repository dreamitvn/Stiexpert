"""Document extraction service using PaperQA2/PyMuPDF."""
import logging
from typing import Optional

logger = logging.getLogger(__name__)


class DocumentService:
    """Handles PDF extraction and metadata parsing."""

    def extract_from_pdf(self, file_path: str) -> dict:
        """
        Extract structured metadata from a PDF file.
        Uses PyMuPDF for text extraction and PaperQA2 for semantic parsing.

        Returns:
            dict with keys: title, abstract, keywords, journal, year, co_authors
        """
        # TODO: Implement PaperQA2 integration
        # Phase 1: Basic PyMuPDF text extraction
        try:
            import fitz  # PyMuPDF
            doc = fitz.open(file_path)
            full_text = ""
            for page in doc:
                full_text += page.get_text()
            doc.close()

            # Basic heuristic extraction
            return self._parse_academic_pdf(full_text)
        except ImportError:
            logger.warning("PyMuPDF not installed, returning empty extraction")
            return self._empty_result()
        except Exception as e:
            logger.error(f"PDF extraction failed: {e}")
            return self._empty_result()

    def _parse_academic_pdf(self, text: str) -> dict:
        """Basic heuristic parsing of academic PDF text."""
        lines = text.strip().split('\n')
        title = lines[0] if lines else ""
        abstract = ""

        # Find abstract section
        for i, line in enumerate(lines):
            if 'abstract' in line.lower():
                abstract = ' '.join(lines[i+1:i+10])
                break

        return {
            'title': title[:500],
            'abstract': abstract[:2000],
            'keywords': [],
            'journal': None,
            'year': None,
            'co_authors': [],
            'full_text_preview': text[:3000],
        }

    def _empty_result(self) -> dict:
        return {
            'title': None,
            'abstract': None,
            'keywords': [],
            'journal': None,
            'year': None,
            'co_authors': [],
        }
