import requests
import random
import time
from datetime import datetime, timezone
import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class BinSimulator:
    def __init__(self):
        self.base_url = "http://localhost:5000/api"
        self.bins_status = {}
        
    def get_all_bins(self):
        try:
            response = requests.get(f"{self.base_url}/collections/")
            if response.status_code == 200:
                return response.json()
            else:
                logger.error(f"Failed to get bins: {response.status_code}")
                return []
        except Exception as e:
            logger.error(f"Error getting bins: {str(e)}")
            return []

    def update_bin_status(self, bin_id: int, status: str, previous_status: str):
        try:
            response = requests.put(
                f"{self.base_url}/collections/{bin_id}",
                json={
                    "status": status,
                    "previous_status": previous_status
                }
            )
            if response.status_code == 200:
                logger.info(f"Updated bin {bin_id} status from {previous_status} to {status}")
            else:
                logger.error(f"Failed to update bin {bin_id}: {response.status_code}")
        except Exception as e:
            logger.error(f"Error updating bin {bin_id}: {str(e)}")

    def simulate_bin_filling(self):
        bins = self.get_all_bins()
        
        for bin in bins:
            if bin['id'] not in self.bins_status:
                self.bins_status[bin['id']] = self._status_to_percentage(bin['status'])

        while True:
            current_time = datetime.now(timezone.utc)
            
            for bin_id, fill_level in self.bins_status.items():
                # Random increase or decrease between -20% and +10%
                change = random.uniform(-20, 10)
                new_fill_level = max(0, min(100, fill_level + change))
                
                previous_status = self._percentage_to_status(fill_level)
                new_status = self._percentage_to_status(new_fill_level)
                
                if previous_status != new_status:
                    self.bins_status[bin_id] = new_fill_level
                    self.update_bin_status(bin_id, new_status, previous_status)
                    
            sleep_time = random.uniform(60, 300)
            logger.info(f"Sleeping for {sleep_time:.2f} seconds")
            time.sleep(sleep_time)

    def _status_to_percentage(self, status: str) -> float:
        return {
            'Empty': 0.0,
            'Half-full': 50.0,
            'Overflowing': 100.0
        }.get(status, 0.0)

    def _percentage_to_status(self, percentage: float) -> str:
        if percentage < 30:
            return 'Empty'
        elif percentage < 80:
            return 'Half-full'
        else:
            return 'Overflowing'

if __name__ == "__main__":
    simulator = BinSimulator()
    logger.info("Starting bin simulation...")
    simulator.simulate_bin_filling()