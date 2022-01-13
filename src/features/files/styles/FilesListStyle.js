import styled from 'styled-components';
import { BsFillArrowLeftSquareFill } from 'react-icons/bs';

export const StyledFilesList = styled.div`
  display: flex;
  flex-direction: column;
  width: 80%;
  margin: 16px auto 0;
`;

export const Toolbar = styled.div`
  display: flex;
  align-items: center;
`;

export const Path = styled.div`
  width: 100%;
  margin-left: 8px;
  padding: 4px 8px;
  border-radius: 4px;
  background-color: ${({ theme }) => theme.colors.el1};
  color: ${({ theme }) => theme.colors.text.el1};
  font-size: large;
`;

export const BackArrow = styled(BsFillArrowLeftSquareFill)`
  width: 30px;
  height: 30px;
  color: ${({ theme }) => theme.colors.primary};
  cursor: pointer;
`;

export const TableContainer = styled.div`
  margin-top: 16px;
  padding: 4px 8px;
  border-radius: 4px;
  background-color: ${({ theme }) => theme.colors.el1};
`;

export const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  table-layout: fixed;
`;

export const TableHead = styled.thead``;

export const TableBody = styled.tbody`
  tr {
    border-bottom: thin solid ${({ theme }) => theme.colors.text.el1Dark};
  }

  tr:last-child {
    border-bottom: none;
  }

  tr:hover {
    background-color: ${({ theme }) => theme.colors.hover.el1};
  }
`;

export const TableRow = styled.tr`
  cursor: ${({ isDir }) => (isDir ? 'pointer' : 'default')};
`;

export const TableHCell = styled.th`
  text-align: center;
  color: ${({ theme }) => theme.colors.primary};
  padding-bottom: 4px;

  &:first-child {
    text-align: left;
  }
`;

export const TableBCell = styled.td`
  text-align: center;
  padding: 2px 0;

  &:first-child {
    text-align: left;
  }
`;
