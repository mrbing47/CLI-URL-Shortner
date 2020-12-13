# CLI URL SHORTNER

This is a **_cli based url shortner_** and very easy to use.

-   Stores the _aliases_ on your local machine.
-   Stores the data in **JSON** format which is very easy to maintain.
-   Allows the user to open a link directly from their console.

<br/>

> **_NOTE:_** Currently supports windows as the command is batch file, but very easy to duplicate in shell.

## Setup

---

Follow the below steps in the **exact order**:

0. Make sure you have Node.js installed.
1. Run `npm i` or `npm install` to install the requied packages.
2. Edit `url.cmd` file to add the project directory.
3. Add this project to the [**_Environment Variables_**](https://www.architectryan.com/2018/03/17/add-to-the-path-on-windows-10/) in order to use the command in CLI.
4. Use following commands to use this _awesome_ project.

</br>

## Commands

---

```
    Arguments
    ---------

    -c  [alias] [valid Web URL] => To create a new alias.
    -u  [alias] [valid Web URL] => To update an existing alias.
    -d  [alias]                 => To delete an alias.


    Flags
    -----

    -a  --all   To view all the aliases.
    -h  --help  To view help.
```

### Examples

```
> url -c "google" "https://google.com"
> url -u "google" "https://google.in"

> url "google"

> url -a

google  =>  https://google.in

> url -d "google"
```
