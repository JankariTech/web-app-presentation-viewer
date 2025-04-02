.PHONY: installOcis installOpencloud dependenciesOcis dependenciesOpencloud install clean package

installOcis: dependenciesOcis install

installOpencloud: dependenciesOpencloud install

dependenciesOcis: clean
	$(MAKE) package PACKAGE_JSON=package-ocis.json
	$(MAKE) depencenciesReplacement SOURCE=opencloud-eu DEST=ownclouders

dependenciesOpencloud: clean
	$(MAKE) package PACKAGE_JSON=package-opencloud.json
	$(MAKE) depencenciesReplacement SOURCE=ownclouders DEST=opencloud-eu

package:
	jq -s '.[0] * .[1]' package-common.json $(PACKAGE_JSON) > package.json

depencenciesReplacement:
	find . -type f \( -name "*.ts" -o -name "*.vue" -o -name "*.prettierrc"  \) -not \( -path "./node_modules/*" -o -path "./dist/*" \) -print0 | xargs -0 sed -i 's/${SOURCE}/${DEST}/g'

clean:
	rm -f package.json
	rm -rf dist
	rm -f pnpm-lock.yaml

install:
	pnpm install
