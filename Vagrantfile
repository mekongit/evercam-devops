Vagrant.configure(2) do |config|
  config.ssh.insert_key = false

  config.vm.box = "ubuntu/trusty64"
  config.vm.define "evercam-devops"

  config.vm.network :forwarded_port, guest: 80, host: 8888
  config.vm.network :forwarded_port, guest: 1935, host: 1935
  config.vm.network :forwarded_port, guest: 3000, host: 3000
  config.vm.network :forwarded_port, guest: 4000, host: 4000
  config.vm.network :forwarded_port, guest: 9292, host: 9292
  config.vm.network :private_network, ip: "192.168.50.50"

  config.vm.synced_folder ".", "/vagrant", type: "rsync"
  config.vm.provider "virtualbox" do |vb|
    vb.customize ["modifyvm", :id, "--natdnsproxy1", "off"]
    vb.customize ["modifyvm", :id, "--natdnshostresolver1", "off"]
  end

  config.vm.provider "virtualbox" do |vb|
    vb.cpus = 4
    vb.memory = "2048"
    # NOTE: Uncomment in case of connection problems:
    # vb.gui = true
  end

  config.vm.provision "ansible" do |ansible|
    ansible.playbook = "ansible/dev-playbook.yml"
    ansible.extra_vars = {
      ansible_ssh_user: "vagrant",
      remote_user: "vagrant"
    }
  end
end
