## Installation evercam-server without vagrant and ansible

#### Install dependencies

* [Python](https://www.python.org/downloads/)
* [Git](http://git-scm.com/downloads)

Install needed system packages
Fedora
```
sudo dnf install make automake gcc gcc-c++ kernel-devel git wget openssl-devel ncurses-devel wxBase3 wxGTK3-devel m4 autoconf readline-devel libyaml-devel libxslt-devel libffi-devel libtool unixODBC-devel unzip curl
```
Ubuntu
```
sudo apt-get install build-essential git wget libssl-dev libreadline-dev libncurses5-dev zlib1g-dev m4 curl wx-common libwxgtk3.0-dev autoconf
```
Optional Erlang dependencies
If you want Erlang to generate its docs when compiling, or if you need the jinterface or the ODBC applications, then you may need to install some extra dependencies. The Erlang compilation script simply skips these if dependencies are not met, so all of this is optional. For Ubuntu and derivatives these dependencies seem to be the java and javac to be installed, and:
```
sudo apt-get install libxml2-utils xsltproc fop unixodbc unixodbc-bin unixodbc-dev
```
Install asdf and its plugins
asdf lives in https://github.com/asdf-vm/asdf

#### Setup asdf module to install Erlang, Elixir

Copy-paste the following into command line:

```
git clone https://github.com/asdf-vm/asdf.git ~/.asdf --branch v0.7.6
```

On Ubuntu (and other Linux distros):

```
echo -e '\n. $HOME/.asdf/asdf.sh' >> ~/.bashrc
echo -e '\n. $HOME/.asdf/completions/asdf.bash' >> ~/.bashrc
```

On macOS:

```
echo -e '\n. $HOME/.asdf/asdf.sh' >> ~/.bash_profile
echo -e '\n. $HOME/.asdf/completions/asdf.bash' >> ~/.bash_profile
```

> For most plugins, it is good if you have installed the following packages OR their equivalent on your OS

> * **Ubuntu**: `automake autoconf libreadline-dev libncurses-dev libssl-dev libyaml-dev libxslt-dev libffi-dev libtool unixodbc-dev`
> * **macOS**: Install these via homebrew `coreutils automake autoconf openssl libyaml readline libxslt libtool unixodbc`

##### Add asdf plugins for Elixir and Erlang

```
asdf plugin-add erlang https://github.com/asdf-vm/asdf-erlang.git'
asdf plugin-add elixir https://github.com/asdf-vm/asdf-elixir.git'
```

##### Install Erlang using asdf

```
asdf install erlang 22.0.7'
```

Set Erlang version using asdf

```
asdf global erlang 22.0.7'
```

##### Install Elixir using asdf

```
asdf install elixir 1.10.0'
```

Set Elixir version using asdf
```
asdf global elixir 1.10.0'
```

##### Install hex and rebar

```
mix local.hex --force
mix local.rebar --force
```

#### Install PostgreSQL, PostGIS & pgadmin
Install PostgreSQL according to Ubuntu version, This steps is for ubuntu 17.04, If you have any other ubuntu version follow the steps mentioned in the below link after selecting your ubuntu version.

https://www.postgresql.org/download/linux/ubuntu/

`wget --quiet -O - https://www.postgresql.org/media/keys/ACCC4CF8.asc | sudo apt-key add -`

After importing GPG key, add repository contents to your Ubuntu 18.04/16.04 system:

`echo "deb http://apt.postgresql.org/pub/repos/apt/ `lsb_release -cs`-pgdg main" |sudo tee  /etc/apt/sources.list.d/pgdg.list`

`sudo apt-get update`

`sudo apt -y install postgresql-12 postgresql-client-12`

Install PostGIS according to PostgreSQL version these steps are for PostgreSQL 9.6.

Check your PostgreSQL Version:

`psql --version`

`sudo apt install postgresql-12-postgis-2.5`

#### Setting Up PostgreSQL
The postgres installation doesn't setup a user for you, so you'll need to follow these steps to create a user with permission to create databases.

`sudo -u postgres createuser {{username}} -s`

`# Set database username and password postgres, you can do the following`

`sudo -u postgres psql`

`postgres=# \password`

#### Create a new database

```
mix ecto.create
mix ecto.load
mix ecto.migrate
```

#### Run Evercam Server Locally
For running server locally, Run:

`iex -S mix phx.server`

## Installation using ansible

This repo is used for automated provisioning and configuration of developer and production environments needed to run Evercam system. This README will explain how to setup the developer environment.

When finished with the README, you will have a Vagrant Virtual Machine running Ubuntu 14.04 LTS with the following software:

* Ruby
* Elixir
* Erlang
* Node.js
* Redis
* Memcached
* Postgres with Postgis
* Nginx with Nginx-RTMP

### Installation

These instructions assume that you're running either Linux or OS X (Ansible doesn't work on Windows).

##### Install Host dependencies

* [Virtualbox](https://www.virtualbox.org/wiki/Downloads)
* [Vagrant](http://www.vagrantup.com/downloads.html)
* [Python](https://www.python.org/downloads/)
* [Ansible 2.0.1.0](http://docs.ansible.com/ansible/intro_installation.html)
* [Git](http://git-scm.com/downloads)

##### Clone this repository and it's submodules

```
git clone https://github.com/evercam/evercam-devops.git && cd evercam-devops
git pull && git submodule init && git submodule update && git submodule status
git submodule foreach --recursive "git checkout master && git pull"
```

##### Install Ansible dependencies

```
sudo ansible-galaxy install -r ansible/requirements.yml --force
```

##### Copy example `.env` file into required directories

```
cp .env evercam-dashboard/ && cp .env evercam-models/ && cp .env evercam-media/
```

##### Run Vagrant and ssh into the VM

```
vagrant up && vagrant ssh
```

Grab a cup of your favorite beverage, this is going to take some time...

### Testing

```
cd /vagrant/evercam-dashboard
bundle exec rspec --pattern 'c*/*_spec.rb,h*/*_spec.rb'

cd /vagrant/evercam-media
mix test
```

### Usage

Now start the Media server:

```
cd /vagrant/evercam-media
EVERCAM_LOCAL=true mix phoenix.server
```

And in another terminal tab/window start the Dashboard server:

```
cd /vagrant/evercam-dashboard
EVERCAM_LOCAL=true bundle exec rails server -b 0.0.0.0
```

And in another terminal tab/window start the Phony camera for offline tests:

```
cd /vagrant/phony_camera
EVERCAM_LOCAL=true node index
```

Open [http://localhost:3000/](http://localhost:3000/) in a browser and you'll see the dashboard of the Next Big Thing&trade;

### Documentation

**All** of the Evercam documentation can be found here: https://github.com/evercam/evercam-media/wiki
