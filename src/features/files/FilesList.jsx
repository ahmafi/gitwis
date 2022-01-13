import React, { useCallback, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import path from 'path';
import { fetchDirectory, selectCurrentFilesSorted } from './filesSlice';
import {
  BackArrow,
  Path,
  StyledFilesList,
  Table,
  TableBCell,
  TableBody,
  TableContainer,
  TableHCell,
  TableHead,
  TableRow,
  Toolbar,
} from './styles/FilesListStyle';

function FilesList() {
  const dispatch = useDispatch();
  const currentPath = useSelector((state) => state.files.currentPath);
  const status = useSelector((state) => state.files[currentPath].status);

  useEffect(() => {
    if (status === 'idle') {
      dispatch(fetchDirectory(currentPath));
    }
  }, [status, dispatch, currentPath]);

  const files = useSelector(
    (state) =>
      status === 'fulfilled' && selectCurrentFilesSorted(state, currentPath)
  );

  const changePath = useCallback(
    (event) => {
      const selectedTr = event.currentTarget;
      const name = selectedTr.querySelector('.name').innerText;
      dispatch(fetchDirectory(path.join(currentPath, name)));
    },
    [dispatch, currentPath]
  );

  const renderFiles = () => (
    <TableContainer>
      <Table>
        <TableHead>
          <TableRow>
            {Object.keys(files[0]).map((key) => (
              <TableHCell key={key}>{key}</TableHCell>
            ))}
          </TableRow>
        </TableHead>

        <TableBody>
          {files.map((file) => (
            <TableRow
              key={file.name}
              onClick={file.isDir ? changePath : undefined}
              isDir={file.isDir}
            >
              {Object.entries(file).map(([key, value]) => (
                <TableBCell className={key} key={key}>
                  {value !== null && value.toString()}
                </TableBCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );

  const back = useCallback(() => {
    if (currentPath !== '/') {
      dispatch(fetchDirectory(path.join(currentPath, '..')));
    }
  }, [dispatch, currentPath]);

  return (
    <StyledFilesList>
      <Toolbar>
        <BackArrow onClick={back} />
        <Path>{`${currentPath}`}</Path>
      </Toolbar>
      {status === 'fulfilled' && files.length > 0 && renderFiles()}
    </StyledFilesList>
  );
}

export default FilesList;
