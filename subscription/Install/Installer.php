<?php

declare(strict_types=1);

namespace Mollie\Subscription\Install;

class Installer extends AbstractInstaller
{
    /** @var InstallerInterface */
    private $databaseInstaller;

    /** @var InstallerInterface */
    private $attributeInstaller;

    /** @var InstallerInterface */
    private $hookInstaller;

    public function __construct(
        InstallerInterface $databaseInstaller,
        InstallerInterface $attributeInstaller,
        InstallerInterface $hookInstaller
    ) {
        $this->databaseInstaller = $databaseInstaller;
        $this->attributeInstaller = $attributeInstaller;
        $this->hookInstaller = $hookInstaller;
    }

    public function install(): bool
    {
        if (!$this->databaseInstaller->install()) {
            $this->errors = $this->databaseInstaller->getErrors();

            return false;
        }

        if (!$this->attributeInstaller->install()) {
            $this->errors = $this->attributeInstaller->getErrors();

            return false;
        }

        if (!$this->hookInstaller->install()) {
            $this->errors = $this->hookInstaller->getErrors();

            return false;
        }

        return true;
    }
}
