import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import path from 'path';
import { fetchDirectory } from './filesSlice';

function FilesList() {
  const dispatch = useDispatch();
  const currentPath = useSelector((state) => state.files.currentPath);
  const status = useSelector(state => 
    state.files[currentPath].status
  );
  
  useEffect(() => {
    if (status === 'idle') {
      dispatch(fetchDirectory(currentPath))
    }
  }, [status, dispatch, currentPath])
  
  const files = useSelector((state) => {
    if (state.files[currentPath].filesList) {
      const sortedByName = [...state.files[currentPath].filesList];
      sortedByName.sort((firstEl, secondEl) => {
        if (!secondEl.isDir
           || secondEl.name.toLowerCase() > firstEl.name.toLowerCase()) {
          return -1;
        }
        return 0;
      });
      return sortedByName;
    }
  });

  const changePath = (selectedTr) => {
    const isDir = selectedTr.classList.contains('dir');
    if (isDir) {
      const name = selectedTr.querySelector('.name').innerText;
      dispatch(fetchDirectory(path.join(currentPath, name)));
    }
  };

  const renderFiles = () => (
    <table
      style={{
        width: '100%',
      }}
    >
      <thead>
        <tr>
          {Object.keys(files[0]).map((key) => (
            <th key={key} style={{ textAlign: 'left' }}>{key}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {files.map((file) => (
          <tr
            key={file.name}
            onClick={(event) => changePath(event.currentTarget)}
            className={file.isDir ? 'dir' : 'file'}
          >
            {Object.entries(file).map(([key, value]) => (
              <td
                key={key}
                className={key}
              >
                {value !== null && value.toString()}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );

  const back = () => {
    if (currentPath !== '/') {
      dispatch(fetchDirectory(path.join(currentPath, '..')));
    }
  };

  return (
    <div>
      <h2>{`Current Path:  ${currentPath}`}</h2>
      <div>
        <button type="button" onClick={() => back()}>Back</button>
      </div>
      {(files && files.length > 0) ? renderFiles() : null}
    </div>
  );
}

export default FilesList;
