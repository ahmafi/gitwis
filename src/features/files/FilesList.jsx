import React, { useCallback, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import path from 'path';
import { fetchDirectory, selectCurrentFilesSorted } from './filesSlice';

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
      const isDir = selectedTr.classList.contains('dir');
      if (isDir) {
        const name = selectedTr.querySelector('.name').innerText;
        dispatch(fetchDirectory(path.join(currentPath, name)));
      }
    },
    [dispatch, currentPath]
  );

  const renderFiles = () => (
    <table
      style={{
        width: '100%',
      }}
    >
      <thead>
        <tr>
          {Object.keys(files[0]).map((key) => (
            <th key={key} style={{ textAlign: 'left' }}>
              {key}
            </th>
          ))}
        </tr>
      </thead>

      <tbody>
        {files.map((file) => (
          <tr
            className={file.isDir ? 'dir' : 'file'}
            key={file.name}
            onClick={changePath}
          >
            {Object.entries(file).map(([key, value]) => (
              <td className={key} key={key}>
                {value !== null && value.toString()}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );

  const back = useCallback(() => {
    if (currentPath !== '/') {
      dispatch(fetchDirectory(path.join(currentPath, '..')));
    }
  }, [dispatch, currentPath]);

  return (
    <div>
      <h2>{`Current Path:  ${currentPath}`}</h2>

      <div>
        <button onClick={back} type='button'>
          {currentPath}
        </button>
      </div>

      {status === 'fulfilled' && files.length > 0 && renderFiles()}
    </div>
  );
}

export default FilesList;
