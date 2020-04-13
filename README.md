# Cockpit Rimauwaf Plugin

Scaffolding for a [Cockpit](http://www.cockpit-project.org) module.

# Getting and building the source

Make sure you have `npm` available (usually from your distribution package).
These commands check out the source and build it into the `dist/` directory:

```
git clone https://github.com/asklinux/cockpit-rimauwaf.git
cd cockpit-rimauwaf
make
```
#Configure server

install apache and mod_security on centos 8
```
$dnf -y install httpd
$dnf -y install mod_security
$cd /etc/httpd
$git clone https://github.com/SpiderLabs/owasp-modsecurity-crs.git
$cd owasp-modsecurity-crs
$cp crs-setup.conf.example crs-setup.conf

$touch /etc/httpd/conf.d/rimauwaf.conf

vi /etc/httpd/conf.d/rimauwaf.conf
```

add configure in rimauwaf.conf

<IfModule security2_module>
Include owasp-modsecurity-crs/crs-setup.conf
Include owasp-modsecurity-crs/rules/*.conf
</IfModule>




# Installing

`make install` compiles and installs the package in `/usr/share/cockpit/`. The
convenience targets `srpm` and `rpm` build the source and binary rpms,
respectively. Both of these make use of the `dist-gzip` target, which is used
to generate the distribution tarball. In `production` mode, source files are
automatically minified and compressed. Set `NODE_ENV=production` if you want to
duplicate this behavior.

For development, you usually want to run your module straight out of the git
tree. To do that, link that to the location were `cockpit-bridge` looks for packages:

```
mkdir -p ~/.local/share/cockpit
ln -s `pwd`/dist ~/.local/share/cockpit/rimauwaf
```

After changing the code and running `make` again, reload the Cockpit page in
your browser.

You can also use
[watch mode](https://webpack.js.org/guides/development/#using-watch-mode) to
automatically update the webpack on every code change with

    $ npm run watch

or

    $ make watch

# Running eslint

Cockpit rimauwaf uses [ESLint](https://eslint.org/) to automatically check
JavaScript code style in `.js` and `.jsx` files.

The linter is executed within every build as a webpack preloader.

For developer convenience, the ESLint can be started explicitly by:

    $ npm run eslint

Violations of some rules can be fixed automatically by:

    $ npm run eslint:fix

Rules configuration can be found in the `.eslintrc.json` file.

# Automated Testing

Run `make check` to build an RPM, install it into a standard Cockpit test VM
(centos-7 by default), and run the test/check-application integration test on
it. This uses Cockpit's Chrome DevTools Protocol based browser tests, through a
Python API abstraction. Note that this API is not guaranteed to be stable, so
if you run into failures and don't want to adjust tests, consider checking out
Cockpit's test/common from a tag instead of master (see the `test/common`
target in `Makefile`).

After the test VM is prepared, you can manually run the test without rebuilding
the VM, possibly with extra options for tracing and halting on test failures
(for interactive debugging):

    TEST_OS=centos-7 test/check-application -tvs

You can also run the test against a different Cockpit image, for example:

    TEST_OS=fedora-28 make check

# Vagrant

This directory contains a Vagrantfile that installs and starts cockpit on a
Fedora 26 cloud image. Run `vagrant up` to start it and `vagrant rsync` to
synchronize the `dist` directory to `/usr/local/share/cockit/rimauwaf`. Use
`vagrant rsync-auto` to automatically sync when contents of the `dist`
directory change.

