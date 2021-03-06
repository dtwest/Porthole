export interface Scan {
  address: string;
  ports: string;
  updated_date: string;
  created_date: string;
  uri: string;
}

export interface ScanResponse { 
  scans: Scan[];
  page: number;
  pages: number; 
  total: number; 
  next: boolean;
}

export default Scan
