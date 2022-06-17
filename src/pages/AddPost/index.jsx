import React from 'react';
import TextField from '@mui/material/TextField';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import SimpleMDE from 'react-simplemde-editor';

import 'easymde/dist/easymde.min.css';
import styles from './AddPost.module.scss';
import { Link, Navigate, useNavigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { selectIsAuth } from "../../redux/slices/auth";
import axios from "../../axios";

export const AddPost = () => {
  const {id} = useParams();
  const navigate = useNavigate()
  const [imageUrl, setImageUrl] = React.useState('');
  const [isLoading, setIsLoading] = React.useState(false);
  const [text, setText] = React.useState('');
  const [title, setTitle] = React.useState('');
  const [tags, setTags] = React.useState('');
  const inputFileRef = React.useRef(null);

  const isEditing = Boolean(id);

  const isAuth = useSelector(selectIsAuth);

  const handleChangeFile = async (e) => {
    try {
      const formData = new FormData();
      const file = e.target.files[0];
      formData.append('image', file)
      const {data} = await axios.post('/upload', formData)
      setImageUrl(data.url)
    } catch (e) {
      console.log(e);
      alert('Error load File')
    }
  };

  const onClickRemoveImage = () => {
    setImageUrl('')
  };

  const onChange = React.useCallback((value) => {
    setText(value);
  }, []);

  const onSubmit = async () => {
    try {
      setIsLoading(true)

      const fields = {
        title,
        tags,
        imageUrl,
        text
      }

      const {data} = isEditing
        ? await axios.patch(`/posts/${id}`, fields)
        : await axios.post('/posts', fields);

      const _id = isEditing ? id : data._id;

      navigate(`/posts/${_id}`)
    } catch (e) {
      console.log(e);
      alert('Error load Post')
    }
  }

  React.useEffect(() => {
    if (id) {
      axios
        .get(`/posts/${id}`)
        .then(({data}) => {
          setTitle(data.title);
          setText(data.text);
          setImageUrl(data.imageUrl);
          setTags(data.tags.join(','));
        })
        .catch(err => {
          console.warn(err);
          alert('Ошибка при получений статей!')
        })
    }
  }, [])

  const options = React.useMemo(
    () => ({
      spellChecker: false,
      maxHeight: '400px',
      autofocus: true,
      placeholder: 'Введите текст...',
      status: false,
      autosave: {
        enabled: true,
        delay: 1000,
      },
    }),
    [],
  );

  if (!window.localStorage.getItem('token') && !isAuth) {
    return <Navigate to='/'/>
  }

  return (
    <Paper style={{padding: 30}}>
      <Button variant="outlined"
              onClick={() => inputFileRef.current.click()}
              size="large">
        Загрузить превью
      </Button>
      <input type="file"
             ref={inputFileRef}
             onChange={handleChangeFile}
             hidden/>
      {imageUrl && (
        <>
          <Button variant="contained" color="error" onClick={onClickRemoveImage}>
            Удалить
          </Button>
          <img className={styles.image} src={`${process.env.REACT_APP_API_URL}${imageUrl}`} alt="Uploaded"/>
        </>
      )}
      <br/>
      <br/>
      <TextField classes={{root: styles.title}}
                 variant="standard"
                 placeholder="Заголовок статьи..."
                 value={title}
                 onChange={e => setTitle(e.target.value)}
                 fullWidth
      />
      <TextField classes={{root: styles.tags}}
                 variant="standard"
                 placeholder="Тэги"
                 value={tags}
                 onChange={e => setTags(e.target.value)}
                 fullWidth/>
      <SimpleMDE className={styles.editor} value={text} onChange={onChange} options={options}/>
      <div className={styles.buttons}>
        <Button onClick={onSubmit} size="large" variant="contained">
          {isEditing ? 'Сохранить' : 'Опубликовать'}
        </Button>
        <Link to="/">
          <Button size="large">Отмена</Button>
        </Link>
      </div>
    </Paper>
  );
};
