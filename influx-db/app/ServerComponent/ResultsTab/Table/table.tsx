import React, { useMemo, useState, useEffect } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface ResultTableProps {
  data: Array<{ _measurement: any; _field: any; _value: number; _time: string | number | Date }>;
  bucket: string;
  setIsTableSet: (isSet: boolean) => void;
}

export const ResultTable: React.FC<ResultTableProps> = ({ data, bucket, setIsTableSet }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [filters, setFilters] = useState({
    bucket: '',
    measurement: '',
    field: '',
    value: '',
    time: ''
  });

  useEffect(() => {
    if (data && data.length > 0) {
      setIsTableSet(true);  
    } else {
      setIsTableSet(false);  
    }
  }, [data, setIsTableSet]);

  const formattedData = useMemo(() => {
    if (!data) return [];
    return data.map((item: { _measurement: any; _field: any; _value: number; _time: string | number | Date; }) => ({
      _bucket: bucket || 'N/A',
      _measurement: item._measurement || 'N/A',
      _field: item._field || 'N/A',
      _value: typeof item._value === 'number' ? item._value.toFixed(2) : (item._value || 'N/A'),
      _time: item._time ? new Date(item._time).toLocaleString() : 'N/A'
    }));
  }, [data, bucket]);

  const filteredData = useMemo(() => {
    return formattedData.filter((item: { _bucket: any; _measurement: any; _field: any; _value: any; _time: any; }) => 
      (item._bucket || '').toLowerCase().includes(filters.bucket.toLowerCase()) &&
      (item._measurement || '').toLowerCase().includes(filters.measurement.toLowerCase()) &&
      (item._field || '').toLowerCase().includes(filters.field.toLowerCase()) &&
      (item._value || '').toString().includes(filters.value) &&
      (item._time || '').toLowerCase().includes(filters.time.toLowerCase())
    );
  }, [formattedData, filters]);

  const totalPages = Math.ceil((filteredData?.length || 0) / pageSize);

  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize;
    return filteredData.slice(startIndex, startIndex + pageSize);
  }, [filteredData, currentPage, pageSize]);

  const handleFilterChange = (key:any, value:any) => {
    setFilters(prev => ({ ...prev, [key]: value }));
    setCurrentPage(1);  // Reset to first page when filter changes
  };

  if (!data || data.length === 0) {
    return <div className="flex items-center justify-center gap-2 space-y-0 py-5 sm:flex-row text-center">
              No data selected or available, Please make a selection
            </div>;
  }

  return (
    <div className="w-full overflow-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>
              Bucket
              <Input 
                placeholder="Filter bucket"
                value={filters.bucket}
                onChange={(e) => handleFilterChange('bucket', e.target.value)}
                className="mt-1"
              />
            </TableHead>
            <TableHead>
              Measurement
              <Input 
                placeholder="Filter measurement"
                value={filters.measurement}
                onChange={(e) => handleFilterChange('measurement', e.target.value)}
                className="mt-1"
              />
            </TableHead>
            <TableHead>
              Field
              <Input 
                placeholder="Filter field"
                value={filters.field}
                onChange={(e) => handleFilterChange('field', e.target.value)}
                className="mt-1"
              />
            </TableHead>
            <TableHead>
              Value
              <Input 
                placeholder="Filter value"
                value={filters.value}
                onChange={(e) => handleFilterChange('value', e.target.value)}
                className="mt-1"
              />
            </TableHead>
            <TableHead>
              Time
              <Input 
                placeholder="Filter time"
                value={filters.time}
                onChange={(e) => handleFilterChange('time', e.target.value)}
                className="mt-1"
              />
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {paginatedData.map((row:any, index:any) => (
            <TableRow key={index}>
              <TableCell>{row._bucket}</TableCell>
              <TableCell>{row._measurement}</TableCell>
              <TableCell>{row._field}</TableCell>
              <TableCell>{row._value}</TableCell>
              <TableCell>{row._time}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <div className="flex justify-between items-center mt-4">
        <div className="flex items-center space-x-2">
          <span>Rows per page:</span>
          <Select
            value={pageSize.toString()}
            onValueChange={(value) => {
              setPageSize(Number(value));
              setCurrentPage(1);
            }}
          >
            <SelectTrigger className="w-[70px]">
              <SelectValue placeholder={pageSize} />
            </SelectTrigger>
            <SelectContent>
              {[10, 20, 50, 100].map((size) => (
                <SelectItem key={size} value={size.toString()}>
                  {size}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="flex items-center space-x-2">
          <Button
            onClick={() => setCurrentPage(page => Math.max(1, page - 1))}
            disabled={currentPage === 1}
          >
            Previous
          </Button>
          <span>{`Page ${currentPage} of ${totalPages}`}</span>
          <Button
            onClick={() => setCurrentPage(page => Math.min(totalPages, page + 1))}
            disabled={currentPage === totalPages}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
};