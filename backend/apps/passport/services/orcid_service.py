"""ORCID public API integration service."""
import logging
from typing import Optional
import urllib.request
import json

logger = logging.getLogger(__name__)

ORCID_API_BASE = "https://pub.orcid.org/v3.0"


class OrcidService:
    """Fetch and parse data from ORCID public API."""

    def fetch_publications(self, orcid_id: str) -> list[dict]:
        """
        Fetch publication list from ORCID public API.

        Args:
            orcid_id: ORCID identifier (e.g., '0000-0002-1825-0097')

        Returns:
            List of parsed publication dicts
        """
        url = f"{ORCID_API_BASE}/{orcid_id}/works"
        headers = {"Accept": "application/json"}

        try:
            req = urllib.request.Request(url, headers=headers)
            with urllib.request.urlopen(req, timeout=30) as response:
                data = json.loads(response.read().decode())

            publications = []
            for group in data.get('group', []):
                summary = group.get('work-summary', [{}])[0]
                pub = {
                    'title': self._get_title(summary),
                    'journal': summary.get('journal-title', {}).get('value'),
                    'year': self._get_year(summary),
                    'doi': self._get_doi(summary),
                    'type': summary.get('type'),
                }
                publications.append(pub)

            logger.info(f"Fetched {len(publications)} publications from ORCID {orcid_id}")
            return publications

        except Exception as e:
            logger.error(f"ORCID API error for {orcid_id}: {e}")
            return []

    def _get_title(self, summary: dict) -> Optional[str]:
        title_obj = summary.get('title', {})
        if title_obj and 'title' in title_obj:
            return title_obj['title'].get('value')
        return None

    def _get_year(self, summary: dict) -> Optional[int]:
        pub_date = summary.get('publication-date')
        if pub_date and pub_date.get('year'):
            try:
                return int(pub_date['year']['value'])
            except (ValueError, TypeError):
                pass
        return None

    def _get_doi(self, summary: dict) -> Optional[str]:
        ids = summary.get('external-ids', {}).get('external-id', [])
        for eid in ids:
            if eid.get('external-id-type') == 'doi':
                return eid.get('external-id-value')
        return None
