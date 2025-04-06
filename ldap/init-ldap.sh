#!/bin/bash

# Start the LDAP server in the background
/container/tool/run &

# Wait for the LDAP server to be ready
until ldapsearch -x -H ldaps://localhost:636 -D "cn=admin,dc=example,dc=com" -w "${LDAP_ADMIN_PASSWORD}" -b "" -s base "(objectclass=*)" 1>/dev/null 2>&1; do
echo "Waiting for LDAP server to be ready..."
sleep 2
done

# Apply the LDIF file
ldapadd -x -D "cn=admin,dc=example,dc=com" -w "${LDAP_ADMIN_PASSWORD}" -f /ldif/01-test-users.ldif || {
echo "Failed to apply LDIF file. Check the file syntax or if entries already exist."
}

# Keep the container running by waiting for the background process
wait