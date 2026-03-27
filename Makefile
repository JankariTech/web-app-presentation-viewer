.PHONY: install-ocis install-opencloud dependencies-ocis dependencies-opencloud install clean package

install-ocis: dependencies-ocis install

install-opencloud: dependencies-opencloud install

dependencies-ocis: clean
	$(MAKE) package PACKAGE_JSON=package-ocis.json
	$(MAKE) dependencies-replacement SOURCE=opencloud-eu DEST=ownclouders

dependencies-opencloud: clean
	$(MAKE) package PACKAGE_JSON=package-opencloud.json
	$(MAKE) dependencies-replacement SOURCE=ownclouders DEST=opencloud-eu

package:
	jq -s '.[0] * .[1]' package-common.json $(PACKAGE_JSON) > package.json

dependencies-replacement:
	find . -type f \( -name "*.ts" -o -name "*.vue" -o -name "*.prettierrc"  \) -not \( -path "./node_modules/*" -o -path "./dist/*" \) -print0 | xargs -0 sed -i 's/${SOURCE}/${DEST}/g'

clean:
	rm -f package.json
	rm -rf dist
	rm -f pnpm-lock.yaml

install:
	pnpm install
