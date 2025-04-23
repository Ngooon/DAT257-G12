# API Documentation

The documentation for the API is visualized using Swagger and is available when the Django server is running.

- The current working endpoints in can be found at <http://localhost:8000/api/docs/current/>
- The documentation for the development endpoints can be found at <http://localhost:8000/api/docs/planned/>


## Generating API Documentation

The documentation is generated using the `drf-spectacular` package. To generate the documentation manually, run the following command in the `\backend` directory:

```bash
python manage.py spectacular --color --file schema.yml
```